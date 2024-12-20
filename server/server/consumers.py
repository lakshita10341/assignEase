# consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json

class SubmissionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_id = self.scope['url_route']['kwargs']['group_id']
        self.group_name = f"group_{self.group_id}"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

  
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')

        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "submission_event",
                "message": message,
            }
        )

    async def submission_event(self, event):
        message = event['message']

        await self.send(text_data=json.dumps({
            "message": message
        }))
