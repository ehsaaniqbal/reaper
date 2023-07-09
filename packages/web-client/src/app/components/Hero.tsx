import React, { useEffect, useState } from "react";
import {
  Spacer,
  Input,
  Button,
  useToasts,
  Spinner,
  Grid,
} from "@geist-ui/core";
import Result, { Channel } from "./Result";

const Hero = () => {
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Channel[]>([]);

  const { setToast } = useToasts({ placement: "topRight" });

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setValue(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    setLoading(true);

    e.preventDefault();

    const regex = /^(?:\s*https?:\/\/\S+\s*,\s*)*\s*https?:\/\/\S+\s*$/gm;
    const isMatch = regex.test(value);

    if (!isMatch) {
      setError("URL(s) must be valid and comma separated");
      setLoading(false);
      return;
    }

    const postData = {
      urls: value.split(","),
    };

    postData.urls.forEach((url, index, array) => {
      let newURL = url.trim();
      if (!new URL(url).pathname.includes("/about")) {
        newURL = url.endsWith("/") ? `${url}about})` : `${url}/about`;
      }
      array[index] = newURL;
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        setError("Failed to scrape!");
        setLoading(false);
        throw new Error("Request failed with status " + response.status);
      }

      const data = await response.json();
      if (data.length > 0) {
        setResults(data);
      } else {
        setError("Please enter a valid URL");
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Failed to scrape!");
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (error) {
      setToast({
        text: error,
        type: "error",
      });
    }
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center p-16">
      <div className="flex flex-col items-center w-9/12 lg:w-7/12">
        <div className="flex items-center gap-4">
          <h1 className="leading-[2] tracking-tighter font-extrabold text-6xl bg-[linear-gradient(180deg,_#fff,_#adadad)] bg-clip-text text-transparent">
            Reaper
          </h1>
          {loading ? <Spinner scale={1.5} /> : null}
        </div>
        <h4 className="pt-6 leading-[2] tracking-tighter font-semibold text-2xl bg-[linear-gradient(180deg,_#fff,_#adadad)] bg-clip-text text-transparent">
          Enter the URL(s) of the YouTube channel(s) you wish to scrape
        </h4>
        <div className="flex flex-row gap-3 w-full">
          <Input
            placeholder="https://www.youtube.com/@MrBeast"
            width="100%"
            scale={1.2}
            value={value}
            onChange={handleValue}
            type={error.length > 0 ? "error" : "default"}
          />
          <Button
            onClick={handleSubmit}
            width="10%"
            disabled={error.length > 0 || value.length === 0 ? true : false}
            loading={loading}
          >
            Go
          </Button>
        </div>
        <Spacer h={1} />
      </div>
      <Grid.Container
        className="pt-10 max-w-2xl"
        gap={2}
        justify="center"
        alignItems="center"
      >
        {results?.map((res) => {
          return (
            <Grid key={res.id}>
              <Result
                id={res.id}
                name={res.name}
                links={res.links}
                channel_url={res.channel_url}
                description={res.description}
              />
            </Grid>
          );
        })}
      </Grid.Container>
    </main>
  );
};

export default Hero;
