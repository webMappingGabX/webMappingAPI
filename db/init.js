const { Workspace } = require("../models/models");


const createPublicWorkspace = async () => {

    const PUBLIC_WORKSPACE_NAME = "Espace de travail public";
    const PUBLIC_WORKSPACE_DESCRIPTION = "Espace de travail accessible a tous";

    // Verify if workspace already exists
    const isWorkspaceExists = await Workspace.findOne( { where: { owner : null, name : PUBLIC_WORKSPACE_NAME } } );

    if(isWorkspaceExists != null) return;

    await Workspace.create({
        "name" : PUBLIC_WORKSPACE_NAME,
        "description" : PUBLIC_WORKSPACE_DESCRIPTION,
        "owner" : null,
        "public" : true
    });
}

module.exports = createPublicWorkspace;