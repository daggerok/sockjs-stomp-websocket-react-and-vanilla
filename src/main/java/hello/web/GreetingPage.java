package hello.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class GreetingPage {

    @GetMapping({""})
    public String indexRedirect() {
        return "redirect:/";
    }

    @GetMapping({"/"})
    public String index() {
        return "/index.html";
    }

    @GetMapping({"/react"})
    public String reactRedirect() {
        return "redirect:/react/";
    }

    @GetMapping({"/react/"})
    public String react() {
        return "/react/react.html";
    }
}
