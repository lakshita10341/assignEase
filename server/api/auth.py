from telnetlib import EL
from django.shortcuts import redirect
import requests
from rest_framework import generics
import os
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken

# from serializers import RegisterSerializer
# from models import User

CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET_ID= os.getenv('CLIENT_SECRET_ID')
redirect_uri='http://127.0.0.1:8000/api/oauth/getToken/'
authoriseURL = 'https://channeli.in/oauth/authorise/'
token_URL = 'https://channeli.in/open_auth/token/'
getUserDataURL = 'https://channeli.in/open_auth/get_user_data/'
logout = 'https://channeli.in/open_auth/revoke_token'

def getOAuthUser(request):
    print('k')
    URL = authoriseURL + '?client_id='+CLIENT_ID+'&redirect_uri='+redirect_uri+'&state=Authorised'
    return redirect(URL)
    

def getOAuthTokens(request):
        OAuthCode = request.GET.get('code') 
        print(CLIENT_ID)
        tokenParams = {
               'client_id' : CLIENT_ID,
               'client_secret':CLIENT_SECRET_ID,
               'grant_type': 'authorization_code',
               'redirect_uri' : redirect_uri,
               'code':OAuthCode,
               'state':'authoriseed',
        }
        print(OAuthCode)
        r = requests.post(token_URL, data =tokenParams)
        # if(r.status == 200):
        print(r.status_code)
     
        if r.status_code == 200:
            try: 
                response_data = r.json()
                print(response_data)
                   
                access_token = response_data.get('access_token')
                refresh_token = response_data.get('refresh_token')
                print(access_token),
                header = {
                "Authorization":  f'Bearer {access_token}',
                }

                getData = requests.get(url=getUserDataURL, headers = header)
                print(getData.status_code)
                data = getData.json()
                print(data)
               
                email = data.get('contactInformation',{}).get('emailAddress')
                username = email.split('@')[0]
                print(username)
                print(email)
                
                if User.objects.filter(email=email).exists():
                     print('User already exists')
                     return user
                    
                
                else:
                    print('creating user')
                    try:
                    
                        user = User.objects.create(username= username, email = email)

                        print(user)
                        user.save()

                        refresh = RefreshToken.for_user(user)
                        tokens = {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                             }
                        print(tokens)
                        user.access = tokens['access']
                        user.refresh = tokens['refresh']
                        user.save()
                        print('yes')
                        return user
                    except Exception as e:
                            print(f"Error occurred: {e}")
                
                  
               
            except ValueError as e:
                print(f"Error decoding JSON: {e}")
           


                









