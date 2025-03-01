# FrazeWise API

## Deployment

### Building and publishing to Docker Hub

⚠️ Before building the Docker image make sure the dependencies are up to date in the `api.package.json` file.
This file has the subset of the monorepo dependencies that are needed to run the server in order to reduce the image file size.

To publish a new version of the Docker image on Docker Hub run this command:

```shell
npm run build-publish:api
```

This updates the patch version in `api.package.json`, uses that to build and tag the image of the server, and pushes it to Docker Hub.

### Running on the server

On the server use the "base" `docker-compose.yml` file with the commands

```shell
docker-compose up -d
docker-compose stop
docker-compose start
docker-compose down
```

Make sure there is a `.env` file with all the PROD variable contents in the project folder.

When there is a new version published to Docker Hub make sure to remove the old image and container so Docker will pull the new one.

For the initial VPS server setup see [this Gist](https://gist.github.com/KinPeter/5728e4f07348be7353e1298d5f264118).

### Server logs

Open the logs of an existing container:

```shell
docker logs <container_id>

# Follow the logs in real-time (like tail -f)
docker logs -f <container_id>

# Show timestamps
docker logs -t <container_id>

# Show last n lines
docker logs --tail=100 <container_id>

# Combine options (follow + timestamps + last 100 lines)
docker logs -f -t --tail=100 <container_id>
```

JSON format logs for an existing container:

```shell
/var/lib/docker/containers/<container_id>/<container_id>-json.log
```
