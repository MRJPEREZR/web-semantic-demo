package com.wdws.finalProject.controllers;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;

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

import com.wdws.finalProject.models.BodyRequest;

@RestController
@RequestMapping("/sparql")
public class SparqlController {
    private static final String FUSEKI_URL = "http://localhost:3030/rdf-data/query";

    @PostMapping(value = "/query", produces = MediaType.APPLICATION_JSON_VALUE)
    public String executeSparqlQuery(@RequestBody BodyRequest sparqlQuery) {
        try {
            String queryString = sparqlQuery.getSparqlQuery();
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
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\": \"An error occurred while processing the SPARQL query.\"}";
        }
    }
}
