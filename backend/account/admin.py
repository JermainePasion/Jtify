from django.contrib import admin
from account.models import *
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
# from account.models import EmailConfirmationToken

class UserModelAdmin(BaseUserAdmin):
  # The fields to be used in displaying the User model.
  # These override the definitions on the base UserModelAdmin
  # that reference specific fields on auth.User.
  list_display = ('id', 'email', 'name', 'is_superuser', 'is_active', 'is_artist')
  list_filter = ('is_superuser',)
  fieldsets = (
      ('User Credentials', {'fields': ('email', 'password')}),
      ('Personal info', {'fields': ('name', )}),
      ('Permissions', {'fields': ('is_superuser', 'is_active', 'is_artist', 'is_subscriber')}),
  )
  # add_fieldsets is not a standard ModelAdmin attribute. UserModelAdmin
  # overrides get_fieldsets to use this attribute when creating a user.
  add_fieldsets = (
      (None, {
          'classes': ('wide',),
          'fields': ('email', 'name', 'password1', 'password2'),
      }),
  )
  search_fields = ('email',)
  ordering = ('email', 'id')
  filter_horizontal = ()


# Now register the new UserModelAdmin...
admin.site.register(User, UserModelAdmin)
# admin.site.register(EmailConfirmationToken)
admin.site.register(OTP)
admin.site.register(Profile)
admin.site.register(Contact)
admin.site.register(ArtistRegister)
# admin.site.register(Color)
