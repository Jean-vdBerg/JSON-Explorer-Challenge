import React, { useMemo } from "react";
import {
  Link,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { flatten } from "flat";

export type JsonExplorerProps = {
  jsonData: any;
};

function JsonExplorer({ jsonData }: JsonExplorerProps) {
  const [selectedPath, setSelectedPath] = React.useState<string>("");
  const [selectedValue, setSelectedValue] = React.useState<string>("");

  const flatJsonData = useMemo(
    () => flatten(jsonData) as Record<string, string>,
    [jsonData]
  );
  const jsonDataPathsFull = useMemo(() => {
    const jsonDataPaths = Object.keys(flatJsonData);
    return jsonDataPaths.map(
      (val) => `res.${val.replace(/\.(\d+)\./g, "[$1].")}`
    );
  }, [flatJsonData]);

  const constructLink = (
    key: string,
    value: string,
    hasValue: boolean,
    path: string
  ) => {
    const leadingWhitespace = key.match(/^(\s*)/)?.[0];
    const trimmedKey = key.trimStart();

    return (
      <>
        {leadingWhitespace}
        <Link
          sx={{ cursor: "pointer" }}
          underline="hover"
          onClick={() => {
            if (hasValue) {
              setSelectedPath(path);
              const cleanedValue = value.trim().replace(/"/g, "");
              if (cleanedValue.endsWith(",")) {
                setSelectedValue(cleanedValue.slice(0, -1));
              } else {
                setSelectedValue(cleanedValue);
              }
            }
          }}
        >
          {trimmedKey}
        </Link>
        :{value}
      </>
    );
  };

  const findParameter = (path: string) => {
    setSelectedPath(path);
    const fullPath = path.substring("res.".length).replace(/\[(\d+)\]/g, ".$1");
    if (flatJsonData[fullPath] !== undefined) {
      setSelectedValue(flatJsonData[fullPath]);
    }
  };

  const constructJSON = () => {
    const jsonDataString = JSON.stringify(jsonData, null, 2);
    const jsonDataLines = jsonDataString.split("\n");
    jsonDataLines.pop();
    jsonDataLines.shift();

    const formattedJSON = [];

    let dataIndex = 0;

    for (const [index, line] of Object.entries(jsonDataLines)) {
      let key = "";
      let value = "";
      let path = "";
      let hasValue = false;

      if (line.includes(":")) {
        const lineComponents = line.split(":");

        key = (lineComponents.shift() || "").replace(/"/g, "");
        value = lineComponents.join(":");
        path = jsonDataPathsFull[dataIndex];

        const valueTrimmed = value.trim();

        if (!["[", "{"].includes(valueTrimmed)) {
          hasValue = true;
          dataIndex++;
        }
      } else {
        key = line;
      }

      formattedJSON.push(
        <ListItem key={index} sx={{ paddingY: 0 }}>
          <ListItemText
            sx={{ marginY: "0px" }}
            primary={
              value ? (
                hasValue ? (
                  constructLink(key, value, hasValue, path)
                ) : (
                  <>
                    {key}:{value}
                  </>
                )
              ) : (
                key
              )
            }
          ></ListItemText>
        </ListItem>
      );
    }

    return formattedJSON;
  };

  return (
    <div className="App">
      <header className="App-header">
        <Typography>Property</Typography>
        <TextField
          onChange={(event) => findParameter(event.target.value)}
          value={selectedPath}
        >
          {selectedPath}
        </TextField>
        <Typography>{selectedValue}</Typography>
        <pre>
          <Typography>Response</Typography>
          <List>{constructJSON()}</List>
        </pre>
      </header>
    </div>
  );
}

export default JsonExplorer;
