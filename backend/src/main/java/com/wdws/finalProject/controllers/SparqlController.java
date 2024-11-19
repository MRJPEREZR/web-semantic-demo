package com.wdws.finalProject.controllers;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.apache.jena.query.Query;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QueryFactory;
import org.apache.jena.query.ResultSet;
import org.apache.jena.query.ResultSetFormatter;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.sparql.exec.http.QueryExecutionHTTP;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wdws.finalProject.models.BodyCustomQuery;
import com.wdws.finalProject.models.BodyRequest;

@RestController
@RequestMapping("/sparql")
public class SparqlController {
    private static final String FUSEKI_URL = "http://localhost:3030/rdf-data/";

    @PostMapping(value = "/queryPerDay", produces = MediaType.APPLICATION_JSON_VALUE)
    public String queryPerDay(@RequestBody BodyRequest body) {
        try {
            String stationId = "omm_station_" + body.getStationId();
            List<String> attributes = body.getAttributes();
            String dateTime = body.getDateTime();

            String queryString = constructQuery(stationId, attributes, dateTime);
            return fusekiQuery(queryString);
            
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\": \"An error occurred while processing the SPARQL query.\"}";
        }
    }

    @PostMapping(value = "/customQuery", produces = MediaType.APPLICATION_JSON_VALUE)
    public String executeSparqlUserQuery(@RequestBody BodyCustomQuery body) {
        try {
            String inputQuery = body.getUserQuery();
            return fusekiQuery(inputQuery);
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\": \"An error occurred while processing the SPARQL query.\"}";
        }
    }

    public static String fusekiQuery (String queryString) throws IOException {
        // Create the SPARQL query object
        Query query = QueryFactory.create(queryString);

        // Use QueryExecutionHTTP to create a connection to the Fuseki server
        try (QueryExecution qexec = QueryExecutionHTTP.service(FUSEKI_URL).query(query).build()) {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            if (query.isSelectType()) {
                ResultSet results = qexec.execSelect();
                ResultSetFormatter.outputAsJSON(outputStream, results);
            } else if (query.isAskType()) {
                boolean result = qexec.execAsk();
                outputStream.write(("{\"boolean\": " + result + "}").getBytes(StandardCharsets.UTF_8));
            } else if (query.isConstructType()) {
                Model model = qexec.execConstruct();
                RDFDataMgr.write(outputStream, model, org.apache.jena.riot.Lang.JSONLD);
            } else if (query.isDescribeType()) {
                Model model = qexec.execDescribe();
                RDFDataMgr.write(outputStream, model, org.apache.jena.riot.Lang.JSONLD);
            }

            return outputStream.toString(StandardCharsets.UTF_8);
        }
    }

    public static String constructQuery(String stationId, List<String> attributes, String dateTime) {
        String sparqlQuery = "";
        String nextDayDate = getNextDayDate(dateTime);
        switch (attributes.size()) {
            case 1:
                sparqlQuery = """
                    PREFIX ex:<http://example.org/station/> 
                    PREFIX sosa:<http://www.w3.org/ns/sosa/> 
                    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                    SELECT 
                        ?observedProperty 
                        (AVG(?result) AS ?average) 
                        (MIN(?result) AS ?min) 
                        (MAX(?result) AS ?max)
                    FROM <http://example.org/dataset>
                    WHERE {
                        ?observation a sosa:Observation ;
                                    sosa:hasFeatureOfInterest ex:%s ;
                                    sosa:observedProperty ?observedProperty ;
                                    sosa:hasSimpleResult ?result ;
                                    sosa:resultTime ?resultTime .
                        FILTER (
                            (?observedProperty = ex:%s) && 
                            (?resultTime >= "%s"^^xsd:dateTime) && 
                            (?resultTime < "%s"^^xsd:dateTime)
                        )
                    }
                    GROUP BY ?observedProperty
                """.formatted(stationId, attributes.get(0), dateTime, nextDayDate);
                break;
            case 2:
                sparqlQuery = """
                    PREFIX ex:<http://example.org/station/> 
                    PREFIX sosa:<http://www.w3.org/ns/sosa/> 
                    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                    SELECT 
                        ?observedProperty 
                        (AVG(?result) AS ?average) 
                        (MIN(?result) AS ?min) 
                        (MAX(?result) AS ?max)
                    FROM <http://example.org/dataset>
                    WHERE {
                        ?observation a sosa:Observation ;
                                    sosa:hasFeatureOfInterest ex:%s ;
                                    sosa:observedProperty ?observedProperty ;
                                    sosa:hasSimpleResult ?result ;
                                    sosa:resultTime ?resultTime .
                        FILTER (
                            (?observedProperty = ex:%s || ?observedProperty = ex:%s) && 
                            (?resultTime >= "%s"^^xsd:dateTime) && 
                            (?resultTime < "%s"^^xsd:dateTime)
                        )
                    }
                    GROUP BY ?observedProperty
                """.formatted(stationId, attributes.get(0), attributes.get(1), dateTime, nextDayDate);
                break;
            case 3:
                sparqlQuery = """
                    PREFIX ex:<http://example.org/station/> 
                    PREFIX sosa:<http://www.w3.org/ns/sosa/> 
                    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                    SELECT 
                        ?observedProperty 
                        (AVG(?result) AS ?average) 
                        (MIN(?result) AS ?min) 
                        (MAX(?result) AS ?max)
                    FROM <http://example.org/dataset>
                    WHERE {
                        ?observation a sosa:Observation ;
                                    sosa:hasFeatureOfInterest ex:%s ;
                                    sosa:observedProperty ?observedProperty ;
                                    sosa:hasSimpleResult ?result ;
                                    sosa:resultTime ?resultTime .
                        FILTER (
                            (?observedProperty = ex:%s || ?observedProperty = ex:%s || ?observedProperty = ex:%s) && 
                            (?resultTime >= "%s"^^xsd:dateTime) && 
                            (?resultTime < "%s"^^xsd:dateTime)
                        )
                    }
                    GROUP BY ?observedProperty
                """.formatted(stationId, attributes.get(0), attributes.get(1), attributes.get(2), dateTime, nextDayDate);
                break;
            case 4:
                sparqlQuery = """
                    PREFIX ex:<http://example.org/station/> 
                    PREFIX sosa:<http://www.w3.org/ns/sosa/> 
                    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                    SELECT 
                        ?observedProperty 
                        (AVG(?result) AS ?average) 
                        (MIN(?result) AS ?min) 
                        (MAX(?result) AS ?max)
                    FROM <http://example.org/dataset>
                    WHERE {
                        ?observation a sosa:Observation ;
                                    sosa:hasFeatureOfInterest ex:%s ;
                                    sosa:observedProperty ?observedProperty ;
                                    sosa:hasSimpleResult ?result ;
                                    sosa:resultTime ?resultTime .
                        FILTER (
                            (?observedProperty = ex:%s || ?observedProperty = ex:%s || ?observedProperty = ex:%s || ?observedProperty = ex:%s) && 
                            (?resultTime >= "%s"^^xsd:dateTime) && 
                            (?resultTime < "%s"^^xsd:dateTime)
                        )
                    }
                    GROUP BY ?observedProperty
                """.formatted(stationId, attributes.get(0), attributes.get(1), attributes.get(2), attributes.get(3), dateTime, nextDayDate);
                break;
            case 5:
                sparqlQuery = """
                    PREFIX ex:<http://example.org/station/> 
                    PREFIX sosa:<http://www.w3.org/ns/sosa/> 
                    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                    SELECT 
                        ?observedProperty 
                        (AVG(?result) AS ?average) 
                        (MIN(?result) AS ?min) 
                        (MAX(?result) AS ?max)
                    FROM <http://example.org/dataset>
                    WHERE {
                        ?observation a sosa:Observation ;
                                    sosa:hasFeatureOfInterest ex:%s ;
                                    sosa:observedProperty ?observedProperty ;
                                    sosa:hasSimpleResult ?result ;
                                    sosa:resultTime ?resultTime .
                        FILTER (
                            (?observedProperty = ex:%s || ?observedProperty = ex:%s || ?observedProperty = ex:%s || ?observedProperty = ex:%s || ?observedProperty = ex:%s) && 
                            (?resultTime >= "%s"^^xsd:dateTime) && 
                            (?resultTime < "%s"^^xsd:dateTime)
                        )
                    }
                    GROUP BY ?observedProperty
                """.formatted(stationId, attributes.get(0), attributes.get(1), attributes.get(2), attributes.get(3), attributes.get(4), dateTime, nextDayDate);
                break;
            default:
                break;
        }
        return sparqlQuery;
    }

    public static String getNextDayDate (String dateTime) {
        // Define the formatter to match the date format
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

        // Parse the string into a LocalDateTime object
        LocalDateTime date = LocalDateTime.parse(dateTime, formatter);

        // Add one day to the date
        LocalDateTime nextDay = date.plusDays(1);

        // Format the result back into a string
        return nextDay.format(formatter);
    }
}
