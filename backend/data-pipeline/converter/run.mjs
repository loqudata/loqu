import glob from "glob"
import fs from "fs"
import { parse, join, dirname } from "path"
import { transformDataStructure } from "./transform.mjs"

// See https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-when-using-the-experimental-modules-flag
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const work_dir = "/mnt/data/dbnomics/datasets"

const stripJSONComments = (data) => {
  var re = new RegExp("//(.*)", "g")
  return data.replace(re, "")
}

// When we use this particular comment function on the context, it removes everything after the double
// slash of a URL
const context = JSON.parse(
  fs.readFileSync(join(__dirname, "./context.jsonld"), "utf-8")
)

let i = 0;

function transformFile(file) {
  if (i%500 == 0)  {
    console.log(`Transforming file #${i}: ${file}`)
  }
  const text = fs.readFileSync(file, "utf-8")
  // Same issue with source data
  // const cleaned = stripJSONComments(text);
  // console.log(cleaned);
  const json = JSON.parse(text)

  if (!json.provider_code || !json.code) {
    console.error(
      `WARN: ${file} has no provider or dataset code. Skipping`
    )
    return
  }

  const transformed = transformDataStructure(json, json.provider_code)

  const out = {
    "@context": context["@context"],
    "@graph": transformed,
  }

  const p = parse(file)
  const outFile = p.dir + "/" + p.name + ".jsonld"

  fs.writeFileSync(outFile, JSON.stringify(out, undefined, 2))
  i++;
}

function tryTransform(file) {
  try {
    transformFile(file)
  } catch (error) {
    console.error(
      `WARN: Failed to transform "${file}". Skipping. Error value: ${error.toString()}`
    )
  }
}

function transform_dsds() {
  glob(work_dir + "/**/*.json", function (err, files) {
    if (err) {
      console.error(err)
    } else {
      for (const file of files) {
        tryTransform(file)
      }
    }
  })
}

transform_dsds();

// tryTransform("./7284.json")
