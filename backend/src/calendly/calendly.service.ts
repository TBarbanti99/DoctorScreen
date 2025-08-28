import { Injectable } from "@nestjs/common";
import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { responseHandler } from "src/helpers/response.handler";
import { prismaService } from "src/prisma/prisma.service";
import { ErrorHandler } from "src/utils/error.handler";




@Injectable()
export class CalendlyService {
    constructor(
        private Prisma : prismaService
    ) {}


    // calendly event list
    async getCalendlyEvents(req:Request , res:Response , next : NextFunction) {
        try {
            const userId = req.user?.id;
            if(!userId) {
                return next(new ErrorHandler("User not found", 404));
            }
            // find user by id
            const user = await this.Prisma.user.findUnique({
                where: {
                    id: userId,
                },
                include:{
                    integrations : {
                      where : {
                        platform  :"calendly"
                      },
                         select:{
                            access_token : true,

                         }
                    }
                }
            });
            if(!user) {
                return next(new ErrorHandler("User not found", 404));
            }
            const access_token = user.integrations[0]?.access_token;
            if(!access_token) {
                return next(new ErrorHandler("Access token not found", 404));
            }
            // Step 1: Fetch current user's details to get the user URI
            const userMeResponse = await axios.get('https://api.calendly.com/users/me', {
                headers: {
                  Authorization: `Bearer ${access_token}`
                }
              });
            const userUri = userMeResponse.data.resource.uri;

            // Step 2: Fetch event types using the user URI
            const eventTypesResponse = await axios.get('https://api.calendly.com/event_types', {
                headers: {
                  Authorization: `Bearer ${access_token}`
                },
                params: {
                  user: userUri 
                }
              });

              responseHandler.sendResponse({
                res,
                statusCode: 200,
                message: "Calendly events fetched successfully",
                data: eventTypesResponse.data.collection
              })
            
        } catch (error:any) {
            return next(new ErrorHandler(error.message, 500));
            
        }
        
    }

    // get all consultations against eventType
    async getCalendlyConsultations(req: Request, res: Response, next: NextFunction) {
        try {
          const userId = req.user?.id;
          if (!userId) return next(new ErrorHandler("User not found", 404));
      
          // Fetch user with Calendly integration
          const user = await this.Prisma.user.findUnique({
            where: { id: userId },
            include: {
              integrations: {
                where: { platform: "calendly" },
                select: {id : true, access_token: true, meta_data: true , orgUri : true },
              },
            },
          });
      
          if (!user) return next(new ErrorHandler("User not found", 404));
      
          const accessToken = user.integrations[0]?.access_token;
          if (!accessToken) return next(new ErrorHandler("Access token not found", 404));

          var orgUri = user.integrations[0]?.orgUri;
          if(!orgUri){
              // Fetch organization URI
              const userMeResponse = await axios.get('https://api.calendly.com/users/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
              });
              const uri = userMeResponse.data.resource.current_organization;
              orgUri = uri;
              await this.Prisma.integration.update({
                where : {
                  //@ts-ignore
                  id : user.integrations[0].id
                },
                data : {
                  orgUri : uri
                }
              })

          }
      
          // Get event type URI from metadata (MUST BE API URI, NOT SCHEDULING URL)
          // @ts-ignore
          const eventTypeUri = user.integrations[0]?.meta_data?.uri;
          if (!eventTypeUri) return next(new ErrorHandler("Event type URI not found", 404));
      
      
          let allBookings = [];
          let nextPageUrl = `https://api.calendly.com/scheduled_events?organization=${encodeURIComponent(orgUri || "")}&event_type=${encodeURIComponent(eventTypeUri)}`;
      
          while (nextPageUrl) {
            const response = await axios.get(nextPageUrl, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
      
            allBookings = allBookings.concat(response.data.collection);
            nextPageUrl = response.data.pagination?.next_page || null;
          }

          const filteredBookings = allBookings.filter((booking: any) => 
            booking.event_type === eventTypeUri
          );
      
          return responseHandler.sendResponse({
            message: "Bookings fetched successfully",
            statusCode: 200,
            data: filteredBookings,
            res: res,
          });
      
        } catch (error: any) {
          return next(
            new ErrorHandler(
              error.response?.data?.message || error.message || "Failed to fetch bookings",
              error.response?.status || 500
            )
          );
        }
      }
}