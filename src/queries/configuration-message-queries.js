module.exports = {

    ProducerConfiguration: `SELECT value FROM producers_property WHERE status = 1 AND producerId Like ? AND property = ? `,

    MessageTemplate: `SELECT * FROM messages WHERE status = 1 AND media = ? AND messageId = ? `,

    MessageUserGroup : `SELECT * FROM tix_media_group WHERE status = 1 AND mediaType = ? AND groupName = ? `,

}