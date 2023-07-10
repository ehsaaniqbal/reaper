import * as xlsx from "xlsx";
import * as fs from "fs";
import { Channel } from "./reaper";

xlsx.set_fs(fs);

export function exportToXLSX(data: Channel[]) {
  const sheetData: {
    name?: string;
    url?: string;
    id?: string;
    channel_url?: string;
    channel_name?: string;
    channel_description?: string;
  }[] = [];

  data.forEach((channel) => {
    channel.links?.forEach((link) => {
      sheetData.push({
        name: link?.name,
        url: link?.url,
        id: channel?.id,
        channel_url: channel?.channel_url,
        channel_name: channel?.name,
        channel_description: channel?.description,
      });
    });
  });

  const workSheet = xlsx.utils.json_to_sheet(sheetData);
  const workBook = xlsx.utils.book_new();

  xlsx.utils.book_append_sheet(workBook, workSheet, "Sheet 1");
  return xlsx.write(workBook, { type: "buffer", bookType: "xlsx" });
}
