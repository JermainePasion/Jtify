from django.core.mail import EmailMessage
import os
from django.conf import settings
# from django.core.mail import send_mail
class Util:
    @staticmethod
    def send_email(data):
        email = EmailMessage(subject=data['email_subject'], body=data['email_body'], from_email=settings.EMAIL_HOST_USER, to=[data['to_email']])
        email.send()

# def send_confirmation_email(email,token_id, user_id):
#     data = {
#         'token_id': str(token_id),
#         'user_id': str(user_id),
#     }
#     message = f'Hi click on the link to verify your email http://localhost:3000/verify-email/{data["token_id"]}/{data["user_id"]}'
#     send_mail(subject='Email Verification', message=message, from_email=settings.EMAIL_HOST_USER, recipient_list=[email], fail_silently=False)
        