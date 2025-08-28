import { Injectable } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from './utils/error.handler';
import { prismaService } from './prisma/prisma.service';
import axios from 'axios';
import { responseHandler } from './helpers/response.handler';

@Injectable()
export class AppService {
  constructor(private Prisma: prismaService) {}
  getHello(): string {
    return 'Hello World!';
  }

  // dashboard data
  async getDashboardData(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(new ErrorHandler('User not found', 404));
      }
      const user = await this.Prisma.user.findUnique({
        where: { id: userId },
        include: {
          integrations: {
            where: { platform: 'calendly' },
            select: {
              id: true,
              access_token: true,
              meta_data: true,
              orgUri: true,
            },
          },
        },
      });

      if (!user) return next(new ErrorHandler('User not found', 404));

      // fetch last 5 reports which are created
      const [reports, totalCount] = await this.Prisma.$transaction([
        this.Prisma.report.findMany({
          where: {
            doctorId: userId,
          },
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            fullName: true,
            createdAt: true,
            description: true,
            doctorId: true,
            reportAssets: true,
            reportEmail: true,
            status: true,
          },
          take: 5,
        }),
        this.Prisma.report.count({
          where: {
            doctorId: userId,
          },
        }),
      ]);

      // ============== fetch consultations
      const accessToken = user.integrations[0]?.access_token;
      if (!accessToken)
        return next(new ErrorHandler('Access token not found', 404));

      var orgUri = user.integrations[0]?.orgUri;
      if (!orgUri) {
        // Fetch organization URI
        const userMeResponse = await axios.get(
          'https://api.calendly.com/users/me',
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        const uri = userMeResponse.data.resource.current_organization;
        orgUri = uri;
        await this.Prisma.integration.update({
          where: {
            //@ts-ignore
            id: user.integrations[0].id,
          },
          data: {
            orgUri: uri,
          },
        });
      }

      // Get event type URI from metadata (MUST BE API URI, NOT SCHEDULING URL)
      // @ts-ignore
      const eventTypeUri = user.integrations[0]?.meta_data?.uri;
      if (!eventTypeUri)
        return next(new ErrorHandler('Event type URI not found', 404));

      let allBookings = [];
      let nextPageUrl = `https://api.calendly.com/scheduled_events?organization=${encodeURIComponent(orgUri || '')}&event_type=${encodeURIComponent(eventTypeUri)}`;

      while (nextPageUrl) {
        const response = await axios.get(nextPageUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        allBookings = allBookings.concat(response.data.collection);
        nextPageUrl = response.data.pagination?.next_page || null;
      }

      const filteredBookings = allBookings.filter(
        (booking: any) => booking.event_type === eventTypeUri,
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      var upcomingConsultations =  filteredBookings?.filter((consultation: any) => {
        const consultationDate = new Date(consultation.start_time);
        return consultationDate >= today;
      });

      return responseHandler.sendResponse({
        message: 'Bookings fetched successfully',
        statusCode: 200,
        data: {
          totalReports: totalCount,
          pendingConsultations: upcomingConsultations.length,
          newMessages: 0,
          activePatients: 0,
          recentReports: reports,
          upcomingConsultations: upcomingConsultations,
        },
        res: res,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
}
