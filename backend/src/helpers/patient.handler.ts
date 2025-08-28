


export class patientHandler {
  // find patient by id
  async findPatientByIdHandler(id: string, Prisma: any) {

    // find by id
    const patient = await Prisma.patient.findUnique({
      where: {
        id,
      },
    });
    return patient;
  }


  // find by email
  async findEmailHandler(email: string, Prisma: any) {
    const patient = await Prisma.patient.findUnique({
      where: {
        email,
      },
    });
    return patient;
  }
}

export const patientHandlerInstance = new patientHandler();