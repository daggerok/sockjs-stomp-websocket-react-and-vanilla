package hello.messages.dto;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.io.Serializable;

@Data
@RequiredArgsConstructor
public class HelloMessage implements Serializable {

    private static final long serialVersionUID = 5166155550680045405L;
    final String name;
}
