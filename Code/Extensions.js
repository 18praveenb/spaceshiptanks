function enumerate(array, block) {
    for (var i=0; i<array.length; ++i) {
        var shouldContinue = block(array[i])
        if (shouldContinue == false) {break}
    }
}

function enumerateChildNodes(childNodes, block) {
    function checkingBlock(node) {
        if (node.nodeType == 1) {
            return block(node)
        }
    }
    enumerate(childNodes, checkingBlock)
}