# ONDC catalogue diagnostic tool

Different buyer apps in ONDC have different requirements and format for catalogue. We are building a tool to analyse a seller catalogue and create a report on, to which buyer apps the current catalogue is compatible. 


* Buyer applications fetch catalogues from the seller applications. These catalogues should satisfy the standards specified by ONDC and the requirements recommended by buyer applications. 
* The tool should act as a validation layer where it will analyse the catalogue against ONDC requirements and buyer apps requirements. 
* If the requirements are satisfied buyer apps may take it to the next stage. If some of the requirements are not satisfactory, a report will be generated automatically and this report will be sent to the particular seller app for making improvements. 
* This process should happen at runtime and the report should be automatically sent to the seller application. 


Requirements for each buyer app are available [here](https://resources.ondc.org/disclosures) under minimum standards for displaying search results to buyers.

On a later stage the tool should generate multiple catalogue versions for each buyer app. 

Say for example if one buyer app requires short and long description about products and if the current catalogue has only long description, use the available information to generate short and long description.

## Architecture and workflow

### Architecture diagram

![architecture](docs/architecture.png)

### workflow

1. Buyer application will fetch the catalogues from the seller applications.
2. The tool will take the catalogue as input and convert it into SQL tables.
3. The tool will also take the requirements from both ONDC standards and buyer app.
4. The related column identifier model will detect the right columns related to the requirements.
5. Code generation model will generate SQL queries and other functions (to check image quality…etc) taking the requirement and related column names as input.
6. Code executor will execute the SQL queries and functions. Produce results. 
7. Report generator model will take the results from the code executor module and convert it into a config file format (in JSON, YAML…etc)
8. Based on the report, the buyer app will decide whether it should proceed to the next stage or send a report to the seller app with inconsistencies in the catalogue.


## UI mockup

![UI](docs/UI.png)

## How to run the POC

1. Clone the repo
2. Install the dependencies using `pip install -r requirements.txt`
3. Create `.env` file inside ops directory and pu the following variables
```
OPENAI_API_KEY=<your openai api key>
```
4. Run the jupyter notebooks in the `notebooks` directory to see the POC components in action.


## Run tests

Run tests using the following command

```
pytest tests
```

