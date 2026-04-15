import { describe, it, expect } from "vitest";

describe("parseCSVLine", () => {
  function parseCSVLine(line: string): string[] {
    const fields: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        fields.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
    fields.push(current);
    return fields;
  }

  it("parses simple CSV line", () => {
    expect(parseCSVLine("a,b,c")).toEqual(["a", "b", "c"]);
  });

  it("handles quoted fields with commas", () => {
    expect(parseCSVLine('1,"Tata Motors Ltd., DVR",NSE')).toEqual([
      "1",
      "Tata Motors Ltd., DVR",
      "NSE",
    ]);
  });

  it("handles empty fields", () => {
    expect(parseCSVLine("a,,c")).toEqual(["a", "", "c"]);
  });

  it("handles single field", () => {
    expect(parseCSVLine("hello")).toEqual(["hello"]);
  });

  it("handles quoted field without commas", () => {
    expect(parseCSVLine('"hello",world')).toEqual(["hello", "world"]);
  });
});
