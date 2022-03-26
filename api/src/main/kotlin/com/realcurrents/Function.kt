package com.realcurrents

import java.util.*
import com.microsoft.azure.functions.*
import com.microsoft.azure.functions.annotation.*

/**
 * Azure Functions with HTTP Trigger.
 */
class Function {

    /**
     * This function listens at endpoint "/api/message". Two ways to invoke it using "curl" command in bash:
     * 1. curl -d "HTTP Body" {your host}/api/message&code={your function key}
     * 2. curl "{your host}/api/message?name=HTTP%20Query&code={your function key}"
     * Function Key is not needed when running locally, it is used to invoke function deployed to Azure.
     * More details: https://aka.ms/functions_authorization_keys
     */
    @FunctionName("message")
    fun run(
            @HttpTrigger(
                    name = "req",
                    methods = [HttpMethod.GET, HttpMethod.POST],
                    authLevel = AuthorizationLevel.FUNCTION) request: HttpRequestMessage<Optional<String>>,
            con"text": ExecutionContext): HttpResponseMessage {

        context.logger.info("HTTP trigger processed a ${request.httpMethod.name} request.")

        val query = request.queryParameters["name"]
        val name = request.body.orElse(query)

        name?.let {
            return request
                    .createResponseBuilder(HttpStatus.OK)
                    .body("""
{
  "text": "Hello, ${name}, from the API"
}
""".trimIndent()
                )
                    .build()
        }

        return request
                .createResponseBuilder(HttpStatus.OK)
                .body("""
{
  "text": "Hello from the API"
}
""".trimIndent()
                )
                .build()
    }

}
