const { app } = require("server");
const { create } = require("server/actions");
const { env } = require("config");
const request = require("supertest");

const apiRequest = request(app);

describe("api routes", () => {
  describe("status endpoint", () => {
    it("should return the server status", done => {
      apiRequest
        .get("/api/status")
        .expect(200)
        .expect("Content-Type", /json/)
        .expect(res => {
          if (res.body.env !== env)
            throw new Error("The correct environment wasn't returned");
          if (new Date(res.body.runningSince).toString() === "Invalid Date")
            throw new Error("An invalid date was returned");
        })
        .end(done);
    });
  });

  describe("bookmarks routes", () => {
    it("should return a list of 25 bookmarks", done => {
      apiRequest
        .get("/api/bookmarks")
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(res => {
          if (!Array.isArray(res.body))
            throw new Error("An array was not returned");
          if (!res.body.length)
            throw new Error("It should have returned a non-empty array");
          if (res.body.length !== 25)
            throw new Error("It returned the wrong number of bookmarks");
        })
        .end(done);
    });

    it("should return a list of paginated bookmarks", done => {
      apiRequest
        .get("/api/bookmarks?page=2")
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(res => {
          if (!Array.isArray(res.body))
            throw new Error("An array was not returned");
          if (!res.body.length)
            throw new Error("It should have returned a non-empty array");
          if (res.body.length < 1)
            throw new Error("It returned the wrong number of bookmarks");
        })
        .end(done);
    });

    it("should create a new bookmark", done => {
      const bookmark = {
        title: "post test bookmark",
        url: "https://duckduckgo.com"
      };

      apiRequest
        .post("/api/bookmarks")
        .send(bookmark)
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(res => {
          if (!Object.keys(res.body).length)
            throw new Error("The new activity was not returned");
          if (res.body.title !== bookmark.title)
            throw new Error("The wrong title was used");
          if (res.body.url !== bookmark.url)
            throw new Error("The wrong URL was used");
        })
        .end(done);
    });

    it("should create a new bookmark through a GET request", done => {
      const bookmark = {
        title: "get create test bookmark",
        url: "https://duckduckgo.com"
      };

      apiRequest
        .get("/api/bookmarks/create")
        .query(bookmark)
        .expect(204)
        .end(done);
    });
  });

  describe("bookmark routes", () => {
    it("should delete a bookmark", done => {
      const bookmark = {
        title: "delete test bookmark",
        url: "https://duckduckgo.com"
      };

      create(bookmark)
        .then(newBookmark => {
          apiRequest
            .delete(`/api/bookmarks/${newBookmark.id}`)
            .expect(200)
            .expect(res => {
              if (!Array.isArray(res.body))
                throw new Error(
                  "An array of existing bookmarks should be returned"
                );
            })
            .end(done);
        })
        .catch(done);
    });
  });

  describe("search route", () => {
    it("should find bookmarks by title", done => {
      const bookmark = {
        title: "search test bookmark",
        url: "https://duckduckgo.com"
      };
      const bookmarkTwo = {
        title: "this should not be found",
        url: "https://google.com"
      };

      Promise.all([create(bookmark), create(bookmarkTwo)])
        .then(newBookmarks => {
          apiRequest
            .get(`/api/search?term=search%20test`)
            .expect(200)
            .expect(res => {
              if (!Array.isArray(res.body))
                throw new Error("An array of bookmarks should be returned");
              if (res.body.length > 1)
                throw new Error("Only one bookmark should have been returned");
              if (res.body[0].title !== bookmark.title)
                throw new Error("The wrong bookmark was returned");
            })
            .end(done);
        })
        .catch(done);
    });
  });
});
