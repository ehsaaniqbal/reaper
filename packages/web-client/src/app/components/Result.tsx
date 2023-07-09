import { Card, Link, Text } from "@geist-ui/core";
import React from "react";

export type Channel = {
  id: string;
  name: string;
  description: string;
  links: { name: string; url: string }[];
  channel_url: string;
};

export type ResultProps = Channel & {};

const Result = ({ id, name, channel_url, description, links }: ResultProps) => {
  return (
    <Link target="_blank" href={channel_url}>
      <Card width="100%" hoverable>
        <Text h4 my={0}>
          {name}
        </Text>
        <Text h6 my={0}>
          {id}
        </Text>
        <Text>{description}</Text>
        <Card.Footer>
          {links?.map((l) => {
            return (
              <Link
                key={l.url}
                px={2}
                block
                icon
                color
                target="_blank"
                href={l.url}
              >
                {l.name}
              </Link>
            );
          })}
        </Card.Footer>
      </Card>
    </Link>
  );
};

export default Result;
