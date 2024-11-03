from urllib.parse import urlencode
from django.forms import ValidationError
from django.shortcuts import redirect
import os
import requests
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken

GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
REDIRECT_URI = 'http://localhost:8000/auth/api/login/google/'
GOOGLE_ACCESS_TOKEN_OBTAIN_URL = 'https://oauth2.googleapis.com/token'
GOOGLE_USER_INFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'
LOGIN_URL='http://localhost:5173/'

def getUser(request):
    params = {
        'response_type': 'code',
        'client_id': os.getenv('GOOGLE_AUTH_CLIENT_ID'),
        'redirect_uri': REDIRECT_URI,
       ' prompt': 'select_account',
        'access_type': 'offline',
        'scope': 'openid email profile'       
  }   
    url_params = urlencode(params)
    auth_url = f"{GOOGLE_AUTH_URL}?{url_params}"
    return redirect(auth_url)

def getUserLogin(request):
    code = request.GET.get('code') 
    error = request.GET.get('error') 

    if error or not code:
        params = urlencode({'error': error})
        return redirect(f'{LOGIN_URL}?{params}')
    
    access_token = google_get_access_token(code=code, REDIRECT_URI=REDIRECT_URI)
    user_data = google_get_user_info(access_token=access_token)
    email=user_data['email']
    username = email.split('@')[0]
    if User.objects.filter(email=email).exists():
                     user = User.objects.get(email=email)
                     print('User already exists')

    else:
        try:
                    
                user = User.objects.create(username= username, email = email)
                        
                print(user)
                user.save()

                        
                        
        except Exception as e:
                print(f"Error occurred: {e}")
    refresh = RefreshToken.for_user(user)
    tokens = {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                             }
              
    user.access = tokens['access']
    user.refresh = tokens['refresh']
             
    user.save()

    return redirect(f'http://localhost:5173/oauth/callback?access={tokens['access']}&refresh={tokens['refresh']}') 
               
          


def google_get_access_token(code: str, REDIRECT_URI: str) -> str:
    data = {
        'code': code,
        'client_id': os.getenv('GOOGLE_AUTH_CLIENT_ID'),
        'client_secret': os.getenv('GOOGLE_AUTH_CLIENT_SECRET_ID'),
        'redirect_uri': REDIRECT_URI,
        'grant_type': 'authorization_code'
    }
    print(data)
    response = requests.post(GOOGLE_ACCESS_TOKEN_OBTAIN_URL, data=data)
    if not response.ok:
        raise ValidationError('Could not get access token from Google.')
    
    access_token = response.json()['access_token']

    return access_token

def google_get_user_info(access_token: str) -> dict[str, any]:
    response = requests.get(
        GOOGLE_USER_INFO_URL,
        params={'access_token': access_token}
    )

    if not response.ok:
        raise ValidationError('Could not get user info from Google.')
    
    return response.json()
    