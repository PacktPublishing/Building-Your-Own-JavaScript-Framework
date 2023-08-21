export default async (req, res) => {
  const packages = await componium.models["package"].findAll();
  componium.logger.info(`Found packages ${JSON.stringify(packages)}`);
  res.json(packages);
};
