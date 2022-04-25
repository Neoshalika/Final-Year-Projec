package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import bit.project.server.entity.Delivery;
import bit.project.server.dao.DeliveryDao;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import bit.project.server.entity.Deliverystatus;
import org.springframework.web.bind.annotation.*;
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
@RequestMapping("/deliveries")
public class DeliveryController{

    @Autowired
    private DeliveryDao deliveryDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public DeliveryController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("delivery");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("DE");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Delivery> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all deliveries", UsecaseList.SHOW_ALL_DELIVERIES);

        if(pageQuery.isEmptySearch()){
            return deliveryDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer vehicleId = pageQuery.getSearchParamAsInteger("vehicle");
        String permitno = pageQuery.getSearchParam("permitno");

        List<Delivery> deliveries = deliveryDao.findAll(DEFAULT_SORT);
        Stream<Delivery> stream = deliveries.parallelStream();

        List<Delivery> filteredDeliveries = stream.filter(delivery -> {
            if(code!=null)
                if(!delivery.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(vehicleId!=null)
                if(!delivery.getVehicle().getId().equals(vehicleId)) return false;
            if(permitno!=null)
                if(!delivery.getPermitno().toLowerCase().contains(permitno.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredDeliveries, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Delivery> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all deliveries' basic data", UsecaseList.SHOW_ALL_DELIVERIES);
        return deliveryDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Delivery get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get delivery", UsecaseList.SHOW_DELIVERY_DETAILS);
        Optional<Delivery> optionalDelivery = deliveryDao.findById(id);
        if(optionalDelivery.isEmpty()) throw new ObjectNotFoundException("Delivery not found");
        return optionalDelivery.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete deliveries", UsecaseList.DELETE_DELIVERY);

        try{
            if(deliveryDao.existsById(id)) deliveryDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this delivery already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Delivery delivery, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new delivery", UsecaseList.ADD_DELIVERY);

        delivery.setTocreation(LocalDateTime.now());
        delivery.setCreator(authUser);
        delivery.setId(null);
        delivery.setDeliverystatus(new Deliverystatus(1));;


        EntityValidator.validate(delivery);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(delivery.getContactno() != null){
            Delivery deliveryByContactno = deliveryDao.findByContactno(delivery.getContactno());
            if(deliveryByContactno!=null) errorBag.add("contactno","contactno already exists");
        }

        if(delivery.getPermitno() != null){
            Delivery deliveryByPermitno = deliveryDao.findByPermitno(delivery.getPermitno());
            if(deliveryByPermitno!=null) errorBag.add("permitno","permitno already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        PersistHelper.save(()->{
            delivery.setCode(codeGenerator.getNextId(codeConfig));
            return deliveryDao.save(delivery);
        });

        return new ResourceLink(delivery.getId(), "/deliveries/"+delivery.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Delivery delivery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update delivery details", UsecaseList.UPDATE_DELIVERY);

        Optional<Delivery> optionalDelivery = deliveryDao.findById(id);
        if(optionalDelivery.isEmpty()) throw new ObjectNotFoundException("Delivery not found");
        Delivery oldDelivery = optionalDelivery.get();

        delivery.setId(id);
        delivery.setCode(oldDelivery.getCode());
        delivery.setCreator(oldDelivery.getCreator());
        delivery.setTocreation(oldDelivery.getTocreation());


        EntityValidator.validate(delivery);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(delivery.getContactno() != null){
            Delivery deliveryByContactno = deliveryDao.findByContactno(delivery.getContactno());
            if(deliveryByContactno!=null)
                if(!deliveryByContactno.getId().equals(id))
                    errorBag.add("contactno","contactno already exists");
        }

        if(delivery.getPermitno() != null){
            Delivery deliveryByPermitno = deliveryDao.findByPermitno(delivery.getPermitno());
            if(deliveryByPermitno!=null)
                if(!deliveryByPermitno.getId().equals(id))
                    errorBag.add("permitno","permitno already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        delivery = deliveryDao.save(delivery);
        return new ResourceLink(delivery.getId(), "/deliveries/"+delivery.getId());
    }

}