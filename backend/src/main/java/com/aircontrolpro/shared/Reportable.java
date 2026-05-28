package com.aircontrolpro.shared;

import java.util.Map;

public interface Reportable {
    Map<String, Object> generateReportData();
    String getReportType();
}
