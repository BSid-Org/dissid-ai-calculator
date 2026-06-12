import React from "react";
import { Composition } from "remotion";
import { AgentFleet, FLEET_FRAMES } from "./AgentFleet";
import { MCPDataFlow, MCP_FRAMES } from "./MCPDataFlow";

export const FPS = 24;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="AgentFleet"
      component={AgentFleet}
      durationInFrames={FLEET_FRAMES}
      fps={FPS}
      width={1280}
      height={720}
    />
    <Composition
      id="MCPDataFlow"
      component={MCPDataFlow}
      durationInFrames={MCP_FRAMES}
      fps={FPS}
      width={1280}
      height={720}
    />
  </>
);
