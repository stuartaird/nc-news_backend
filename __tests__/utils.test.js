const { usernameToUserId } = require("../db/utils/data-manipulation");
const connection = require("../db/connection.js");
afterAll(() => connection.end());

// doesn't mutate arg
// returns an array of objects
// returns arg with updated author key

describe("usernameToUserId: ", () => {
  test("doesn't mutate array arg", async () => {
    const testArray = [
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        article_id: 9,
        created_at: new Date(1586179020000),
      },
      {
        body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        votes: 14,
        author: "butter_bridge",
        article_id: 1,
        created_at: new Date(1604113380000),
      },
      {
        body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        votes: 100,
        author: "icellusedkars",
        article_id: 1,
        created_at: new Date(1583025180000),
      },
    ];

    const testArrayCopy = [
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        article_id: 9,
        created_at: new Date(1586179020000),
      },
      {
        body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        votes: 14,
        author: "butter_bridge",
        article_id: 1,
        created_at: new Date(1604113380000),
      },
      {
        body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        votes: 100,
        author: "icellusedkars",
        article_id: 1,
        created_at: new Date(1583025180000),
      },
    ];
    await usernameToUserId(testArray);
    expect(testArray).toEqual(testArrayCopy);
  });

  test("returns an array of objects", async () => {
    const testArray = [
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        article_id: 9,
        created_at: new Date(1586179020000),
      },
      {
        body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        votes: 14,
        author: "butter_bridge",
        article_id: 1,
        created_at: new Date(1604113380000),
      },
      {
        body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        votes: 100,
        author: "icellusedkars",
        article_id: 1,
        created_at: new Date(1583025180000),
      },
    ];
    const results = await usernameToUserId(testArray);
    expect(results).toEqual(expect.any(Array));
    expect(results).toContainEqual(expect.any(Object));
  });

  test("returns arg with updated author key", async () => {
    const testArray = [
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        article_id: 9,
        created_at: new Date(1586179020000),
      },
      {
        body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        votes: 14,
        author: "butter_bridge",
        article_id: 1,
        created_at: new Date(1604113380000),
      },
      {
        body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        votes: 100,
        author: "icellusedkars",
        article_id: 1,
        created_at: new Date(1583025180000),
      },
    ];
    const results = await usernameToUserId(testArray);
    expect(results).toEqual([
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: 1,
        article_id: 9,
        created_at: new Date(1586179020000),
      },
      {
        body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        votes: 14,
        author: 1,
        article_id: 1,
        created_at: new Date(1604113380000),
      },
      {
        body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        votes: 100,
        author: 2,
        article_id: 1,
        created_at: new Date(1583025180000),
      },
    ]);
  });
});
