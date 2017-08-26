const { create, destroy, find, search } = require("./index");

describe("server api actions", () => {
  describe("create action", () => {
    it("should insert a new bookmark", done => {
      const bookmark = {
        title: "test bookmark",
        url: "https://duckduckgo.com"
      };

      create(bookmark)
        .then(newBookmark => {
          expect(newBookmark).to.be.an("object");
          expect(newBookmark.id).to.be.a("number");
          expect(newBookmark.title).to.equal(bookmark.title);
          expect(newBookmark.url).to.equal(bookmark.url);
          expect(newBookmark.createdAt).to.be.a("date");

          done();
        })
        .catch(done);
    });
  });

  describe("destroy action", () => {
    it("should delete bookmark", done => {
      const bookmark = {
        title: "test bookmark",
        url: "https://duckduckgo.com"
      };

      create(bookmark)
        .then(newBookmark => {
          destroy({ id: newBookmark.id })
            .then(() => {
              find({ id: newBookmark.id }).then(bookmarks => {
                expect(bookmarks).to.have.length(0);

                done();
              });
            })
            .catch(done);
        })
        .catch(done);
    });
  });

  describe("find action", () => {
    it("should find a specific bookmark", done => {
      const bookmark = {
        title: "test bookmark",
        url: "https://duckduckgo.com"
      };

      create(bookmark)
        .then(newBookmark => {
          find({ id: newBookmark.id })
            .then(bookmarks => {
              expect(bookmarks).to.have.length(1);
              expect(bookmarks[0].title).to.equal(bookmark.title);
              expect(bookmarks[0].url).to.equal(bookmark.url);

              done();
            })
            .catch(done);
        })
        .catch(done);
    });

    it("should find all bookmarks", done => {
      find({})
        .then(bookmarks => {
          expect(bookmarks).to.have.length.greaterThan(1);

          done();
        })
        .catch(done);
    });

    it("should find some bookmarks limited by a number", done => {
      find({ limit: 10 })
        .then(bookmarks => {
          expect(bookmarks).to.have.length.greaterThan(1);
          expect(bookmarks.length).to.equal(10);

          done();
        })
        .catch(done);
    });

    it("should find some bookmarks offset by a number", done => {
      find({})
        .then(allBookmarks => {
          find({ offset: 10 })
            .then(bookmarks => {
              expect(bookmarks).to.have.length.greaterThan(1);
              expect(bookmarks.length).to.equal(allBookmarks.length - 10);

              done();
            })
            .catch(done);
        })
        .catch(done);
    });
  });

  describe("search action", () => {
    it("should find bookmarks by title", done => {
      const bookmark = {
        title: "search action test bookmark",
        url: "https://duckduckgo.com"
      };
      const bookmarkTwo = {
        title: "this should not be found",
        url: "https://google.com"
      };

      Promise.all([create(bookmark), create(bookmarkTwo)])
        .then(newBookmarks => {
          search("search action test")
            .then(bookmarks => {
              expect(bookmarks).to.have.length(1);
              expect(bookmarks[0].title).to.equal(bookmark.title);
              expect(bookmarks[0].url).to.equal(bookmark.url);

              done();
            })
            .catch(done);
        })
        .catch(done);
    });
  });
});
