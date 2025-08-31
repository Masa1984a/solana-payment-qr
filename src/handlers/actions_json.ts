// src/handlers/actions_json.ts

export function handleActionsJson(_req: Request): Response {
  const body = {
    rules: [
      { pathPattern: "/pay/*", apiPath: "/api/actions/pay/*" },
      { pathPattern: "/api/actions/**", apiPath: "/api/actions/**" }
    ]
  };

  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}


