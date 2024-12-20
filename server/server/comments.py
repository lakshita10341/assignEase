from channels.generic.websocket import AsyncWebsocketConsumer
import json


class CommentConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        self.subm_id=self.scope['url_route']['kwargs']['subm_id']
        self.subm_name=f"subm_{self.subm_id}"
        await self.channel_layer.group_add(
            self.subm_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.subm_name,
            self.channel_name
        )

    async def receive(self,text_data):
        data = json.loads(text_data)
        comment = data.get('comment')
        await self.channel_layer.group_send(
            self.subm_name,
            {
                "type" : "comment_event",
                "comment" : comment,
            }
        )
    
    async def comment_event(self,event):
        comment = event['comment']
        await self.send(text_data=json.dumps({
            "comment" : comment
        }))
