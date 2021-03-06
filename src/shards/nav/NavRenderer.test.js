import React from "react";
import { mount } from "enzyme";
import PageNavRenderer from "./NavRenderer";
import { Map } from "immutable";

const sourceObject = Map({
  type: "nav",
  items: [
    { type: "link", text: "Introduction", link: "/introduction" },
    { type: "symlink", id: 0 },
    { type: "divider", text: " | " },
    { type: "external", text: "Resources", link: "https://en.wikipedia.org" }
  ],
  renderers: {},
  symlinks: [{ id: 0, text: "Quick start", link: "/quick-start" }]
});

describe("<NavShardRenderer />", () => {
  const mountShardRenderer = ({ sourceObject = {} } = {}) => {
    return mount(
      <PageNavRenderer sourceObject={sourceObject} />
    );
  };

  it("renders without crashing", () => {
    const wrapper = mountShardRenderer({ sourceObject: sourceObject.toObject() });

    expect(wrapper.exists()).toEqual(true);
  });

  it("renders a link", () => {
    const wrapper = mountShardRenderer({ sourceObject: sourceObject.toObject() });

    expect(wrapper.find("li:first-child a[href='/introduction']").text()).toEqual("Introduction");
  });

  it("renders link with a custom renderer", () => {
    const renderer = ({ item }) => {
      return <a href={item.link} className="custom-link-renderer">{item.text}</a>;
    }
    let sourceObject2 = sourceObject.setIn(["renderers", "link"], renderer);
    const wrapper = mountShardRenderer({ sourceObject: sourceObject2.toObject() });

    expect(
      wrapper.find("li:first-child a.custom-link-renderer[href='/introduction']").first().text()
    ).toEqual("Introduction");
  });

  it("renders active link as plain text", () => {
    let sourceObject2 = sourceObject.setIn(["items", 0, "active"], true);
    const wrapper = mountShardRenderer({ sourceObject: sourceObject2.toObject() });

    expect(wrapper.find("li:first-child").html()).toEqual("<li>Introduction</li>");
  });

  it("renders a symlink", () => {
    const wrapper = mountShardRenderer({ sourceObject: sourceObject.toObject() });

    expect(wrapper.find("li").at(1).find("a[href='/quick-start']").text()).toEqual("Quick start");
  });

  it("renders symlink with a custom renderer", () => {
    const renderer = ({ item }) => {
      return <a href={item.link} className="custom-link-renderer">{item.text}</a>;
    }
    let sourceObject2 = sourceObject.setIn(["renderers", "symlink"], renderer);
    const wrapper = mountShardRenderer({ sourceObject: sourceObject2.toObject() });

    expect(wrapper.find(".custom-link-renderer").text()).toEqual("Quick start");
  });

  it("renders active symlink as plain text", () => {
    let sourceObject2 = sourceObject.setIn(["items", 1, "active"], true);
    const wrapper = mountShardRenderer({ sourceObject: sourceObject2.toObject() });

    expect(wrapper.find("li").at(1).first().html()).toEqual("<li>Quick start</li>");
  });

  it('renders "[not linked]" if symlink does not exist', () => {
    let sourceObject2 = sourceObject.setIn(["items", 1, "id"], 1);
    const wrapper = mountShardRenderer({ sourceObject: sourceObject2.toObject() });

    expect(wrapper.find("li").at(1).find(".symlink-error").first().text()).toEqual("[not linked]");
  });

  it("renders a divider", () => {
    const wrapper = mountShardRenderer({ sourceObject: sourceObject.toObject() });

    expect(wrapper.find("li").at(2).text()).toEqual(" | ");
  });

  it("renders divider with a custom renderer", () => {
    const renderer = ({ item }) => {
      return <b>{item.text}</b>;
    }
    let sourceObject2 = sourceObject.setIn(["renderers", "divider"], renderer);
    const wrapper = mountShardRenderer({ sourceObject: sourceObject2.toObject() });

    expect(wrapper.find("li").at(2).first().html()).toEqual("<li><b> | </b></li>");
  });

  it("renders an external link", () => {
    const wrapper = mountShardRenderer({ sourceObject: sourceObject.toObject() });

    expect(
      wrapper
        .find("li")
        .at(3)
        .find("a[href='https://en.wikipedia.org'][target='_blank'][rel='noopener']")
        .text()
    ).toEqual("Resources");
  });

  it("renders external link with a custom renderer", () => {
    const renderer = ({ item }) => {
      return <a href={item.link} target="_blank" rel="noopener"><b>{item.text}</b></a>
    }
    let sourceObject2 = sourceObject.setIn(["renderers", "external"], renderer);
    const wrapper = mount(<PageNavRenderer sourceObject={sourceObject2.toObject()} />);

    expect(
      wrapper
        .find("li")
        .at(3)
        .find("a[href='https://en.wikipedia.org'][target='_blank'][rel='noopener'] b")
        .text()
    ).toEqual("Resources");
  });
});
