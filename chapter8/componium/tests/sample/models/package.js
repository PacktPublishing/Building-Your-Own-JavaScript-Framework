import { DataTypes, Model } from "sequelize";

class Package extends Model {}

Package.init(
  {
    title: DataTypes.STRING,
    address: DataTypes.STRING,
    created: DataTypes.DATE,
  },
  { sequelize: componium.db, modelName: "user" }
);

(async () => {
  await this.db.sync();
  const jane = await Package.create({
    title: "Paper Delivery",
    address: "123 Main St.",
    created: new Date(2023, 1, 1),
  });
  console.log(jane.toJSON());
})();
