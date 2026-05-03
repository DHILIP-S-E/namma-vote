import json
import firebase_admin
from firebase_admin import credentials, messaging
from config import settings

_firebase_initialized = False


def _init_firebase():
    global _firebase_initialized
    if not _firebase_initialized and settings.FIREBASE_SERVICE_ACCOUNT_JSON:
        try:
            sa = json.loads(settings.FIREBASE_SERVICE_ACCOUNT_JSON)
            cred = credentials.Certificate(sa)
            firebase_admin.initialize_app(cred)
            _firebase_initialized = True
        except Exception as e:
            print(f"Firebase init failed: {e}")


async def send_push_to_tokens(tokens: list[str], title: str, body: str, data: dict = None) -> dict:
    """Send FCM push notification to a list of device tokens."""
    _init_firebase()
    if not _firebase_initialized or not tokens:
        return {"sent": 0, "failed": len(tokens), "error": "Firebase not configured"}

    success_count = 0
    failure_count = 0

    # Send in batches of 500 (FCM limit)
    batch_size = 500
    for i in range(0, len(tokens), batch_size):
        batch = tokens[i:i + batch_size]
        try:
            message = messaging.MulticastMessage(
                tokens=batch,
                notification=messaging.Notification(title=title, body=body),
                data=data or {},
                android=messaging.AndroidConfig(
                    priority="high",
                    notification=messaging.AndroidNotification(
                        icon="notification_icon",
                        color="#FF6B35",
                        sound="default",
                    )
                ),
                apns=messaging.APNSConfig(
                    payload=messaging.APNSPayload(
                        aps=messaging.Aps(sound="default", badge=1)
                    )
                ),
                webpush=messaging.WebpushConfig(
                    notification=messaging.WebpushNotification(
                        title=title,
                        body=body,
                        icon="/icons/icon-192.png",
                    )
                )
            )
            response = messaging.send_each_for_multicast(message)
            success_count += response.success_count
            failure_count += response.failure_count
        except Exception as e:
            failure_count += len(batch)
            print(f"FCM batch send failed: {e}")

    return {"sent": success_count, "failed": failure_count}


async def send_push_to_topic(topic: str, title: str, body: str, data: dict = None) -> dict:
    """Send to FCM topic (e.g. 'state_TN', 'constituency_163')."""
    _init_firebase()
    if not _firebase_initialized:
        return {"sent": 0, "failed": 1, "error": "Firebase not configured"}
    try:
        message = messaging.Message(
            topic=topic,
            notification=messaging.Notification(title=title, body=body),
            data=data or {},
        )
        messaging.send(message)
        return {"sent": 1, "failed": 0}
    except Exception as e:
        return {"sent": 0, "failed": 1, "error": str(e)}
