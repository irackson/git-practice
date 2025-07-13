from openai import OpenAI
import requests
import json

client = OpenAI()


def get_weather(latitude, longitude):
    response = requests.get(
        f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"
    )
    data = response.json()
    return data["current"]["temperature_2m"]


tools = [
    {
        "type": "function",
        "name": "get_weather",
        "description": "Get current temperature for provided coordinates in celsius.",
        "parameters": {
            "type": "object",
            "properties": {
                "latitude": {"type": "number"},
                "longitude": {"type": "number"},
            },
            "required": ["latitude", "longitude"],
            "additionalProperties": False,
        },
        "strict": True,
    }
]

context = [
    {
        "role": "user",
        "content": "What's the weather like in New York today? Please tell me in Fahrenheit, and what math you did to convert it from Celsius.",
    }
]

response = client.responses.create(
    model="o3",
    input=context,
    tools=tools,
    store=False,
    include=[
        "reasoning.encrypted_content"
    ],  # Encrypted chain of thought is passed back in the response
)


context += (
    response.output
)  # Add the response to the context (including the encrypted chain of thought)
tool_call = response.output[1]
args = json.loads(tool_call.arguments)


result = get_weather(args["latitude"], args["longitude"])

context.append(
    {
        "type": "function_call_output",
        "call_id": tool_call.call_id,
        "output": str(result),
    }
)

response_2 = client.responses.create(
    model="o3",
    input=context,
    tools=tools,
    store=False,
    include=["reasoning.encrypted_content"],
)

print(response_2.output_text)
