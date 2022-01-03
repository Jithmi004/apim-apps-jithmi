import { OpenAPIBackend } from "openapi-backend";
import addFormats from "ajv-formats";
import { TextEncoder, TextDecoder } from 'util'

/* ####### OpenAPI mock configuration ####### */
// Iterate the OAS tools config file and generate OpenAPIBackend objects and set it to test context globals

const openApiBackends = {};

OASConfigs().map(([apiName, apiConfig]) => {
  const { inputSpec, context } = apiConfig as APIConfig;
  const oasBackend = new OpenAPIBackend({
    definition: getTempPath(inputSpec),
    quick: true,
    customizeAjv: (originalAjv, ajvOpts, validationContext) => {
      // To fix https://github.com/anttiviljami/openapi-backend/issues/230
      addFormats(originalAjv);
      return originalAjv;
    },
    handlers: {
      notFound: async (c, req, res) =>
        res.status(404).json({ err: "not found" }),
    },
  });
  openApiBackends[apiName] = { context, oasBackend };
});
/* ####### End of OpenAPI mock configuration ####### */

global.openApiBackends = openApiBackends;
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

/* ####### DEPRECATED Old configs ####### */

/*  ***** IMPORTANT *****
    Enzyme based unit/integration tests are deprecated and following configurations are solely for Enzyme based test
    Do not modify or extend it unless otherwise absolutely necessary
*/
import React from "react";
import Enzyme, { shallow, render, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import renderer from "react-test-renderer";
import SwaggerParser from "@apidevtools/swagger-parser";
import { APIConfig, getTempPath, OASConfigs } from "./Utils/setupUtils";

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

// ***DEPRECATED*** Make Enzyme functions available in all test files without importing
global.React = React;
global.DEPRECATED_shallow = shallow;
global.DEPRECATED_render = render;
global.DEPRECATED_mount = mount;
global.DEPRECATED_renderer = renderer;
if (global.document) {
  // To resolve createRange not defined issue https://github.com/airbnb/enzyme/issues/1626#issuecomment-398588616
  document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: {
      nodeName: "BODY",
      ownerDocument: document,
    },
  });
}
global.DEPRECATED_apiDef = SwaggerParser.dereference(
  getTempPath("publisher-api.yaml", true)
);