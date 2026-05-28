package com.aircontrolpro.operations;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class OperationPolymorphismTest {

    @Test
    void testTakeoffValidation() {
        Takeoff takeoff = new Takeoff();
        takeoff.setVisibility(1000.0);
        takeoff.setWindSpeed(20.0);
        assertTrue(takeoff.validateOperation(), "Takeoff should be valid with good visibility and low wind");

        takeoff.setVisibility(100.0);
        assertFalse(takeoff.validateOperation(), "Takeoff should be invalid with low visibility");
    }

    @Test
    void testLandingValidation() {
        Landing landing = new Landing();
        landing.setApproachPath("PATH-1");
        landing.setFuelEmergency(false);
        assertTrue(landing.validateOperation(), "Landing should be valid without fuel emergency");

        landing.setFuelEmergency(true);
        assertFalse(landing.validateOperation(), "Landing should be invalid with fuel emergency");
    }
}
