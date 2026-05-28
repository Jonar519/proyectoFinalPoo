package com.aircontrolpro.shared;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "menu_items")
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String label;
    private String icon;
    private String route;
    private String requiredRole;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    @JsonIgnore
    private MenuItem parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<MenuItem> children = new ArrayList<>();

    public MenuItem() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getRoute() { return route; }
    public void setRoute(String route) { this.route = route; }

    public String getRequiredRole() { return requiredRole; }
    public void setRequiredRole(String requiredRole) { this.requiredRole = requiredRole; }

    public MenuItem getParent() { return parent; }
    public void setParent(MenuItem parent) { this.parent = parent; }

    public List<MenuItem> getChildren() { return children; }
    public void setChildren(List<MenuItem> children) { this.children = children; }

    // Método recursivo para buscar un item por label en la jerarquía
    public MenuItem findInHierarchy(String targetLabel) {
        if (this.label != null && this.label.equals(targetLabel)) {
            return this;
        }
        for (MenuItem child : children) {
            MenuItem found = child.findInHierarchy(targetLabel);
            if (found != null) {
                return found;
            }
        }
        return null;
    }
}
