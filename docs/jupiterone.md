# XM Cyber Integration with JupiterOne

## Integration Benefits

- Visualize XM Cyber entities in the JupiterOne graph.
- Monitor changes to XM Cyber entities using JupiterOne alerts.

## How it Works

- JupiterOne periodically fetches entities from XM Cyber to update the graph.
- Write JupiterOne queries to review and monitor updates to the graph, or
  leverage existing queries.
- Configure alerts to take action when JupiterOne graph changes, or leverage
  existing alerts.

## Prerequisites

- XM Cyber supports authentication via an API Key
- You must have permission in JupiterOne to install new integrations.

## Support

If you need help with this integration, contact
[JupiterOne Support](https://support.jupiterone.io).

## How to Use This Integration

### In XM Cyber

1. Request an API Key with permissions to fetch entities
   `GET https://cyberrange.clients.xmcyber.com/api/systemReport/entities`

### In JupiterOne

1. From the top navigation of the J1 Search homepage, select **Integrations**.
2. Scroll down to **XM Cyber** and click it.
3. Click **Add Configuration** and configure the following settings:

- Enter the account name by which you want to identify this XM Cyber account in
  JupiterOne. Select **Tag with Account Name** to store this value in
  `tag.AccountName` of the ingested assets.
- Enter a description to help your team identify the integration.
- Select a polling interval that is sufficient for your monitoring requirements.
  You can leave this as `DISABLED` and manually execute the integration.
- Enter the XM Cyber API key generated for use by JupiterOne.

4. Click **Create Configuration** after you have entered all the values.

## How to Uninstall

1. From the top navigation of the J1 Search homepage, select **Integrations**.
2. Scroll down to **XM Cyber** and click it.
3. Identify and click the **integration to delete**.
4. Click the **trash can** icon.
5. Click **Remove** button to delete the integration.

<!-- {J1_DOCUMENTATION_MARKER_START} -->
<!--
********************************************************************************
NOTE: ALL OF THE FOLLOWING DOCUMENTATION IS GENERATED USING THE
"j1-integration document" COMMAND. DO NOT EDIT BY HAND! PLEASE SEE THE DEVELOPER
DOCUMENTATION FOR USAGE INFORMATION:

https://github.com/JupiterOne/sdk/blob/main/docs/integrations/development.md
********************************************************************************
-->

## Data Model

### Entities

The following entities are created:

| Resources | Entity `_type`   | Entity `_class` |
| --------- | ---------------- | --------------- |
| Entity    | `xmcyber_entity` | `Record`        |

<!--
********************************************************************************
END OF GENERATED DOCUMENTATION AFTER BELOW MARKER
********************************************************************************
-->
<!-- {J1_DOCUMENTATION_MARKER_END} -->
