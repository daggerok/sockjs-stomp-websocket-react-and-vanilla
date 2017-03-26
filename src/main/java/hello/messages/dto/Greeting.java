package hello.messages.dto;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.io.Serializable;

@Data
@RequiredArgsConstructor
public class Greeting implements Serializable {

    private static final long serialVersionUID = 5242427420838566738L;
    final String content;
}
