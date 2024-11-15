package com.wdws.finalProject;

import org.apache.jena.fuseki.main.FusekiServer;
import org.apache.jena.graph.Graph;
import org.apache.jena.graph.Node;
import org.apache.jena.graph.NodeFactory;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.sparql.core.DatasetGraph;
import org.apache.jena.sparql.core.DatasetGraphFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FinalProjectWsApplication implements CommandLineRunner{

	public static void main(String[] args) {
		SpringApplication.run(FinalProjectWsApplication.class, args);
	}

	@Override
	public void run(String... args) {
		String rdfFilePath = "src/main/resources/static/synop.202410.ttl";
		Graph graph = RDFDataMgr.loadGraph(rdfFilePath);

		DatasetGraph datasetGraph = DatasetGraphFactory.createTxnMem();
		Node graphName = NodeFactory.createURI("http://example.org/dataset");
		datasetGraph.addGraph(graphName, graph);

		FusekiServer server = FusekiServer.create().port(3030).add("/rdf-data", datasetGraph).build();
		server.start();

		System.out.println("Fuseki server started on http://localhost:3030/rdf-data");
	}

}
