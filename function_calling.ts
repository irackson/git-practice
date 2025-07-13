import OpenAI from 'openai';
import fetch from 'node-fetch';

const client = new OpenAI();

async function getWeather(
  latitude: number,
  longitude: number
): Promise<number> {
  console.log('Calling weather API with coordinates:', latitude, longitude);
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`
  );
  const data = (await response.json()) as any;
  return data.current.temperature_2m;
}

async function main(): Promise<void> {
  const tools: any[] = [
    {
      type: 'function',
      name: 'get_weather',
      description:
        'Get current temperature for provided coordinates in celsius.',
      parameters: {
        type: 'object',
        properties: {
          latitude: { type: 'number' },
          longitude: { type: 'number' },
        },
        required: ['latitude', 'longitude'],
        additionalProperties: false,
      },
      strict: true,
    },
  ];

  const context: any[] = [
    {
      role: 'user',
      content:
        "What's the weather like in montreal today? Please tell me in Fahrenheit, and what math you did to convert it from Celsius.",
    },
  ];

  const response1: any = await client.responses.create({
    model: 'o3',
    input: context,
    tools,
    store: false,
    include: ['reasoning.encrypted_content'],
  });

  console.log(`res1 output text:`, response1.output_text);

  const newContext = [...context, ...response1.output];
  const toolCall: any = newContext[2];
  const args = JSON.parse(toolCall.arguments);

  const result = await getWeather(args.latitude, args.longitude);

  newContext.push({
    type: 'function_call_output',
    call_id: toolCall.call_id,
    output: String(result),
  });

  const response2: any = await client.responses.create({
    model: 'o3',
    input: newContext,
    tools,
    store: false,
    include: ['reasoning.encrypted_content'],
  });

  console.log(response2.output_text);
}

main().catch(console.error);
