package com.aircontrolpro.service;

import com.aircontrolpro.repository.MenuItemRepository;
import com.aircontrolpro.shared.MenuItem;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MenuService {

    private final MenuItemRepository menuItemRepository;

    public MenuService(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    public List<MenuItem> getMainMenu() {
        String userRole = resolveCurrentRole();
        return menuItemRepository.findByParentIsNull().stream()
                .map(item -> filterMenuItem(item, userRole))
                .filter(item -> item != null)
                .toList();
    }

    private String resolveCurrentRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return "";
        }
        return authentication.getAuthorities().stream()
                .findFirst()
                .map(auth -> auth.getAuthority().replace("ROLE_", ""))
                .orElse("");
    }

    private MenuItem filterMenuItem(MenuItem item, String userRole) {
        List<MenuItem> visibleChildren = item.getChildren().stream()
                .map(child -> filterMenuItem(child, userRole))
                .filter(child -> child != null)
                .toList();

        boolean visible = isVisibleForRole(item.getRequiredRole(), userRole) || !visibleChildren.isEmpty();
        if (!visible) {
            return null;
        }

        MenuItem filtered = new MenuItem();
        filtered.setId(item.getId());
        filtered.setLabel(item.getLabel());
        filtered.setIcon(item.getIcon());
        String route = item.getRoute();
        filtered.setRoute(route == null || route.isBlank() ? null : normalizeRoute(route));
        filtered.setRequiredRole(item.getRequiredRole());
        filtered.setChildren(new ArrayList<>(visibleChildren));
        return filtered;
    }

    private boolean isVisibleForRole(String requiredRole, String userRole) {
        if (userRole == null || userRole.isBlank()) {
            return false;
        }
        if ("ADMIN".equals(userRole)) {
            return true;
        }
        return requiredRole == null || requiredRole.isBlank() || requiredRole.equals(userRole);
    }

    private String normalizeRoute(String route) {
        if (route == null || route.isBlank()) {
            return route;
        }

        String path = route;
        String query = "";
        int queryIndex = route.indexOf('?');
        if (queryIndex >= 0) {
            path = route.substring(0, queryIndex);
            query = route.substring(queryIndex);
        }

        if (!path.startsWith("/dashboard")) {
            path = "/dashboard" + (path.startsWith("/") ? path : "/" + path);
        }

        return path + query;
    }
}
