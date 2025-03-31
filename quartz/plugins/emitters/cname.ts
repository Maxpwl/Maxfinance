import { FilePath, joinSegments } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import fs from "fs"
import chalk from "chalk"
import DepGraph from "../../depgraph"

export function extractDomainFromBaseUrl(baseUrl: string) {
  const url = new URL(`https://${baseUrl}`)
  return url.hostname
}

export const CNAME: QuartzEmitterPlugin = () => ({
  name: "CNAME",
  async getDependencyGraph(_ctx, _content, _resources) {
    return new DepGraph<FilePath>()
  },
  async emit({ argv, cfg }, _content, _resources) {
    if (!cfg.configuration.baseUrl) {
      console.warn(chalk.yellow("CNAME emitter requires `baseUrl` to be set in your configuration"))
      return []
    }
    const path = joinSegments(argv.output, "CNAME")
    const content = extractDomainFromBaseUrl(cfg.configuration.baseUrl)
    if (!content) {
      return []
    }
    await fs.promises.writeFile(path, content)
    return [path] as FilePath[]
  },
})
