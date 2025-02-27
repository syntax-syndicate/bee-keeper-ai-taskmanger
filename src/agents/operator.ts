import { ArXivTool } from "beeai-framework/tools/arxiv";
import { DuckDuckGoSearchTool } from "beeai-framework/tools/search/duckDuckGoSearch";
import { BaseToolsFactory, ToolFactoryMethod } from "@/base/tools-factory.js";

export class ToolsFactory extends BaseToolsFactory {
  async getFactoriesMethods(): Promise<ToolFactoryMethod[]> {
    return [() => new DuckDuckGoSearchTool(), () => new ArXivTool()];
  }
}
