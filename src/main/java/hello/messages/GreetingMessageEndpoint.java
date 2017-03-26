package hello.messages;

import hello.messages.dto.Greeting;
import hello.messages.dto.HelloMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
public class GreetingMessageEndpoint {

    @MessageMapping("/send-greeting-message")
    @SendTo("/topic/greetings")
    public Greeting greeting(HelloMessage message) throws Exception {
        log.info("receinved: {}", message);
        Thread.sleep(1000); // simulated delay
        return new Greeting("Hello, " + message.getName() + "!");
    }
}
