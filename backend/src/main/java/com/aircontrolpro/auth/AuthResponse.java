package com.aircontrolpro.auth;

public class AuthResponse {
    private String token;
    private String refreshToken;
    private String username;
    private String role;

    public AuthResponse() {}

    private AuthResponse(Builder builder) {
        this.token = builder.token;
        this.refreshToken = builder.refreshToken;
        this.username = builder.username;
        this.role = builder.role;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String token;
        private String refreshToken;
        private String username;
        private String role;

        public Builder token(String token) { this.token = token; return this; }
        public Builder refreshToken(String refreshToken) { this.refreshToken = refreshToken; return this; }
        public Builder username(String username) { this.username = username; return this; }
        public Builder role(String role) { this.role = role; return this; }

        public AuthResponse build() {
            return new AuthResponse(this);
        }
    }
}
