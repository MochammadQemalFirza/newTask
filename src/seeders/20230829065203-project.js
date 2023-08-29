"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.bulkInsert(
      "Projects",
      [
        {
          title: "Mobile Developer",
          startDate: "2019-06-08",
          endDate: "2020-06-09",
          techStack: ["Java", "NodeJS", "Golang", "ReactJS"],
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sapien ante, dapibus sed massa eu, ultrices bibendum sapien. Morbi eleifend ex non tortor ultrices, vel congue risus fermentum.",
          postedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "FrontEnd Developer",
          startDate: "2022-01-5",
          endDate: "2023-02-03",
          techStack: ["Java", "NodeJS", "Golang", "ReactJS"],
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sapien ante, dapibus sed massa eu, ultrices bibendum sapien. Morbi eleifend ex non tortor ultrices, vel congue risus fermentum.",
          postedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "BackEnd Developer",
          startDate: "2021-01-06",
          endDate: "2023-02-01",
          techStack: ["NodeJS", "Golang"],
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sapien ante, dapibus sed massa eu, ultrices bibendum sapien. Morbi eleifend ex non tortor ultrices, vel congue risus fermentum.",
          postedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
