import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { SendMailDto } from './dto/send-mail.dto';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Post('test')
  sendTestEmail(@Body() body: SendMailDto) {
    return this.mailService.sendMail(body.to, body.subject, body.html);
  }
}
