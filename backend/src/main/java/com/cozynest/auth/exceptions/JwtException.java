package com.cozynest.auth.exceptions;

public class JwtException extends  RuntimeException{

        public JwtException() {
            super("Token is mismatched, invalid, or expired");
        }

        public JwtException(String message) {
            super(message);
        }

        public JwtException(String message, Throwable cause) {
            super(message, cause);
        }

}
