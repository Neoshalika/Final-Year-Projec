package bit.project.server.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.dao.ProrderDao;
import bit.project.server.entity.Customerorder;
import bit.project.server.entity.Prorder;
import bit.project.server.entity.User;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Customorderitem;
import bit.project.server.dao.CustomorderitemDao;
import bit.project.server.util.helper.PageHelper;
import org.springframework.data.domain.PageRequest;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.util.validation.EntityValidator;
import bit.project.server.util.exception.ConflictException;
import bit.project.server.util.validation.ValidationErrorBag;
import bit.project.server.util.security.AccessControlManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import bit.project.server.util.exception.DataValidationException;
import bit.project.server.util.exception.ObjectNotFoundException;

@CrossOrigin
@RestController
@RequestMapping("/customorderitems")
public class CustomorderitemController{

    @Autowired
    private CustomorderitemDao customorderitemDao;

    @Autowired
    private ProrderDao prorderDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public CustomorderitemController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("customorderitem");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("CI");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Customorderitem> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all customorderitems", UsecaseList.SHOW_ALL_CUSTOMORDERITEMS);

        if(pageQuery.isEmptySearch()){
            return customorderitemDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer customerorderId = pageQuery.getSearchParamAsInteger("customerorder");
        String name = pageQuery.getSearchParam("name");

        List<Customorderitem> customorderitems = customorderitemDao.findAll(DEFAULT_SORT);
        Stream<Customorderitem> stream = customorderitems.parallelStream();

        List<Customorderitem> filteredCustomorderitems = stream.filter(customorderitem -> {
            if(code!=null)
                if(!customorderitem.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(customerorderId!=null)
                if(!customorderitem.getCustomerorder().getId().equals(customerorderId)) return false;
            if(name!=null)
                if(!customorderitem.getName().toLowerCase().contains(name.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredCustomorderitems, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Customorderitem> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all customorderitems' basic data", UsecaseList.SHOW_ALL_CUSTOMORDERITEMS, UsecaseList.ADD_PRORDER, UsecaseList.UPDATE_PRORDER);
        return customorderitemDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Customorderitem get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get customorderitem", UsecaseList.SHOW_CUSTOMORDERITEM_DETAILS);
        Optional<Customorderitem> optionalCustomorderitem = customorderitemDao.findById(id);
        if(optionalCustomorderitem.isEmpty()) throw new ObjectNotFoundException("Customorderitem not found");
        return optionalCustomorderitem.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete customorderitems", UsecaseList.DELETE_CUSTOMORDERITEM);

        try{
            if(customorderitemDao.existsById(id)) customorderitemDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this customorderitem already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Customorderitem customorderitem, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new customorderitem", UsecaseList.ADD_CUSTOMORDERITEM);

        customorderitem.setTocreation(LocalDateTime.now());
        customorderitem.setCreator(authUser);
        customorderitem.setId(null);


        EntityValidator.validate(customorderitem);

        PersistHelper.save(()->{
            customorderitem.setCode(codeGenerator.getNextId(codeConfig));
            return customorderitemDao.save(customorderitem);
        });

        return new ResourceLink(customorderitem.getId(), "/customorderitems/"+customorderitem.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Customorderitem customorderitem, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update customorderitem details", UsecaseList.UPDATE_CUSTOMORDERITEM);

        Optional<Customorderitem> optionalCustomorderitem = customorderitemDao.findById(id);
        if(optionalCustomorderitem.isEmpty()) throw new ObjectNotFoundException("Customorderitem not found");
        Customorderitem oldCustomorderitem = optionalCustomorderitem.get();

        customorderitem.setId(id);
        customorderitem.setCode(oldCustomorderitem.getCode());
        customorderitem.setCreator(oldCustomorderitem.getCreator());
        customorderitem.setTocreation(oldCustomorderitem.getTocreation());


        EntityValidator.validate(customorderitem);

        customorderitem = customorderitemDao.save(customorderitem);
        return new ResourceLink(customorderitem.getId(), "/customorderitems/"+customorderitem.getId());
    }


    @GetMapping("/forproduction")
    public List<Customorderitem> getAllForProduction(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all customorderitems' basic data", UsecaseList.SHOW_ALL_CUSTOMORDERITEMS, UsecaseList.ADD_PRORDER, UsecaseList.UPDATE_PRORDER);
        List<Customorderitem> customorderitemList =  customorderitemDao.findAllForProduction(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        List<Prorder> prorderList = prorderDao.findAll();
        ArrayList<Customorderitem> customorderitems = new ArrayList<>();
        if (prorderList != null){
            prorderList.forEach(prorder -> {
                if (prorder.getCustomorderitem() != null){
                    if (customorderitemList != null){
                        customorderitemList.forEach(customorderitem -> {
                            if (prorder.getCustomorderitem().getId().equals(customorderitem.getId())){
                                customorderitems.add(customorderitem);
                            }
                        });
                    }
                }
            });
        }
        customorderitemList.removeAll(customorderitems);

        return customorderitemList;
    }


    @GetMapping("/bycustomer/{id}")
    public List<Customorderitem> getAllByCustomer(@PathVariable Integer id, PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all customorderitems' basic data", UsecaseList.SHOW_ALL_CUSTOMORDERITEMS, UsecaseList.ADD_PRORDER, UsecaseList.UPDATE_PRORDER);
        List<Customorderitem> customorderitemList = customorderitemDao.findAll();
        ArrayList<Customorderitem> customorderitems = new ArrayList<>();
        customorderitemList.forEach(customorderitem -> {
            if (customorderitem.getCustomerorder().getCustomer().getId().equals(id)){
                customorderitems.add(customorderitem);
            }
        });
        return customorderitems;
    }


}
