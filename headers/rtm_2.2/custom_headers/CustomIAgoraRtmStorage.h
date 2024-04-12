#pragma once

#include "AgoraRtmBase.h"
#include "IAgoraRtmStorage.h"

namespace agora {
namespace rtm {
namespace ext {

struct RtmMetadata {
  // ----------------------------- 👇🏻new API👇🏻 -----------------------------
    /**
     * The key of the metadata item.
     */
    const int64_t majorRevision;
    /**
     * The value of the metadata item.
     */
    const MetadataItem* metadataItems;
    /**
     * The User ID of the user who makes the latest update to the metadata item.
     */
    const uint64_t metadataItemsSize;

    RtmMetadata() : majorRevision(-1),
                    metadataItems(NULL),
                    metadataItemsSize(NULL) {}

  // ----------------------------- 👆🏻new API👆🏻 -----------------------------
};

} // namespace ext
} // namespace rtm
} // namespace agora
