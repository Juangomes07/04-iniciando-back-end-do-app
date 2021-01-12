import Appointment from '../infra/typeorm/entities/Appointment';
import {startOfHour} from 'date-fns';

import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

/*
  [x]Recebimento das informaçãos
  [/]Tratativa de erros/excessões
  [x]Acesso ao repositório
*/

interface IRequest{
  provider_id: string;
  date: Date;
}

/*
Dependency Inversio (SOLID)
 */

class CreateAppointmentService{
  constructor(private appointmentsRepository:IAppointmentsRepository){}

  public async execute({date, provider_id}: IRequest): Promise<Appointment> {

  const appointmentDate = startOfHour(date);

  const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
    appointmentDate,);

    if(findAppointmentInSameDate) {
      throw new AppError('This appointment has already booked')
    }

    const appointment= await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}
export default CreateAppointmentService;